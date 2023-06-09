"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventServiceImpl = void 0;
const fs = __importStar(require("fs"));
const ethers_1 = require("ethers");
const filename = "./apps/registry/data/event-register.json";
class EventServiceImpl {
    getEventData() {
        if (fs.existsSync(filename)) {
            return JSON.parse(fs.readFileSync(filename, "utf8"));
        }
        else {
            return [];
        }
    }
    validateUserInfo(info) {
        if (!info) {
            return "Bad Request: event information";
        }
        if (!info["chatId"]) {
            return "Bad Request: missing chat id";
        }
        if (!info["contractAddress"]) {
            return "Bad Request: missing contract to monitor";
        }
        if (!info["eventName"]) {
            return "Bad Request: missing event to monitor";
        }
        return null;
    }
    saveEventData(data) {
        fs.writeFileSync(filename, JSON.stringify(data));
    }
    generateAlertId() {
        return (Math.random().toString(36).substring(2, 15) +
            Math.random().toString(36).substring(2, 15));
    }
    generateSignatureHash(eventName) {
        return ethers_1.ethers.keccak256(ethers_1.ethers.toUtf8Bytes(eventName));
    }
    addEvent(userInfo) {
        let data = this.getEventData();
        userInfo["signatureHash"] = this.generateSignatureHash(userInfo["eventName"] || "");
        userInfo["alertId"] = this.generateAlertId();
        data.push(userInfo);
        this.saveEventData(data);
    }
    listEvents() {
        return this.getEventData();
    }
    removeEvent(alertId) {
        let data = this.getEventData();
        const initialLength = data.length;
        data = data.filter((item) => item.alertId !== alertId);
        if (initialLength !== data.length) {
            this.saveEventData(data);
            return true;
        }
        return false;
    }
    listEventsByChatId(chatId) {
        let data = this.getEventData();
        return data.filter((item) => item.chatId === chatId);
    }
}
exports.EventServiceImpl = EventServiceImpl;

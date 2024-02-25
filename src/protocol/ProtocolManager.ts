import SignalAttachment from './attachment/SignalAttachment';
import GatewayAttachment from './attachment/GatewayAttachment';
import UdpAttachment from './attachment/UdpAttachment';
import HttpAttachment from './attachment/HttpAttachment';
import NoAnswerAttachment from './attachment/NoAnswerAttachment';
import Message from './common/Message';
import Error from './common/Error';
import Heartbeat from './common/Heartbeat';
import Ping from './common/Ping';
import Pong from './common/Pong';
import PairIntLong from './common/PairIntLong';
import PairLong from './common/PairLong';
import PairString from './common/PairString';
import PairLS from './common/PairLS';
import TripleLong from './common/TripleLong';
import TripleString from './common/TripleString';
import TripleLSS from './common/TripleLSS';
import News from './news/News';
import NewsStock from './news/NewsStock';
import NewsIndustry from './news/NewsIndustry';
import NewsRequest from './news/NewsRequest';
import NewsResponse from './news/NewsResponse';
import NewsOneRequest from './news/NewsOneRequest';
import NewsOneResponse from './news/NewsOneResponse';
import GaiNian from './gn/GaiNian';
import GnRequest from './gn/GnRequest';
import GnResponse from './gn/GnResponse';
import ChatgptMessageRequest from './chatgpt/ChatgptMessageRequest';
import ChatgptMessageNotice from './chatgpt/ChatgptMessageNotice';
import ChatgptForceStopRequest from './chatgpt/ChatgptForceStopRequest';
import ChatMessage from './chat/ChatMessage';
import GroupChatNotice from './chat/GroupChatNotice';
import GroupChatRequest from './chat/GroupChatRequest';
import GroupHistoryMessageRequest from './chat/GroupHistoryMessageRequest';
import GroupHistoryMessageResponse from './chat/GroupHistoryMessageResponse';
import LoginRequest from './auth/LoginRequest';
import LoginResponse from './auth/LoginResponse';
import OssPolicyRequest from './auth/OssPolicyRequest';
import OssPolicyResponse from './auth/OssPolicyResponse';
import OssPolicyVO from './auth/OssPolicyVO';
import LoginByWeChatRequest from './auth/LoginByWeChatRequest';
import LoginByWeChatResponse from './auth/LoginByWeChatResponse';
import MidImagineRequest from './midjourney/MidImagineRequest';
import MidHistoryRequest from './midjourney/MidHistoryRequest';
import MidImagineNotice from './midjourney/MidImagineNotice';
import MidRerollRequest from './midjourney/MidRerollRequest';
import MidSelectRequest from './midjourney/MidSelectRequest';
import BrokerRegisterAsk from './broker/BrokerRegisterAsk';
import BrokerRegisterAnswer from './broker/BrokerRegisterAnswer';
import MidImagineAsk from './broker/MidImagineAsk';
import MidImagineNotify from './broker/MidImagineNotify';
import MidRerollAsk from './broker/MidRerollAsk';
import MidSelectAsk from './broker/MidSelectAsk';
import SeoAsk from './broker/SeoAsk';
import SdSimulateAsk from './broker/SdSimulateAsk';
import SdSimulateAnswer from './broker/SdSimulateAnswer';
import SdSimulateNotify from './broker/SdSimulateNotify';
import StableDiffusionRequest from './sdiffusion/StableDiffusionRequest';
import StableDiffusionResponse from './sdiffusion/StableDiffusionResponse';
import StableDiffusionParameters from './sdiffusion/StableDiffusionParameters';
import InterrogatorPromptRequest from './sdiffusion/InterrogatorPromptRequest';
import InterrogatorPromptResponse from './sdiffusion/InterrogatorPromptResponse';
import SdSimulateRequest from './sdiffusion/SdSimulateRequest';
import SdSimulateNotice from './sdiffusion/SdSimulateNotice';
import SdHistoryRequest from './sdiffusion/SdHistoryRequest';
import SdSimulateResponse from './sdiffusion/SdSimulateResponse';
import SdImage from './sdiffusion/SdImage';
import ImageDownloadRequest from './sdiffusion/ImageDownloadRequest';
import ImageDownloadResponse from './sdiffusion/ImageDownloadResponse';
import ImageDeleteAsk from './sdiffusion/ImageDeleteAsk';
import LlamaMessageAsk from './llama/LlamaMessageAsk';
import LlamaMessageNotify from './llama/LlamaMessageNotify';
import IByteBuffer from "./IByteBuffer";

const protocols = new Map<number, any>();

// initProtocol
protocols.set(0, SignalAttachment);
protocols.set(2, GatewayAttachment);
protocols.set(3, UdpAttachment);
protocols.set(4, HttpAttachment);
protocols.set(5, NoAnswerAttachment);
protocols.set(100, Message);
protocols.set(101, Error);
protocols.set(102, Heartbeat);
protocols.set(103, Ping);
protocols.set(104, Pong);
protocols.set(110, PairIntLong);
protocols.set(111, PairLong);
protocols.set(112, PairString);
protocols.set(113, PairLS);
protocols.set(114, TripleLong);
protocols.set(115, TripleString);
protocols.set(116, TripleLSS);
protocols.set(200, News);
protocols.set(201, NewsStock);
protocols.set(202, NewsIndustry);
protocols.set(203, NewsRequest);
protocols.set(204, NewsResponse);
protocols.set(205, NewsOneRequest);
protocols.set(206, NewsOneResponse);
protocols.set(220, GaiNian);
protocols.set(221, GnRequest);
protocols.set(222, GnResponse);
protocols.set(230, ChatgptMessageRequest);
protocols.set(231, ChatgptMessageNotice);
protocols.set(232, ChatgptForceStopRequest);
protocols.set(240, ChatMessage);
protocols.set(241, GroupChatNotice);
protocols.set(242, GroupChatRequest);
protocols.set(243, GroupHistoryMessageRequest);
protocols.set(244, GroupHistoryMessageResponse);
protocols.set(250, LoginRequest);
protocols.set(251, LoginResponse);
protocols.set(252, OssPolicyRequest);
protocols.set(253, OssPolicyResponse);
protocols.set(254, OssPolicyVO);
protocols.set(255, LoginByWeChatRequest);
protocols.set(256, LoginByWeChatResponse);
protocols.set(270, MidImagineRequest);
protocols.set(271, MidHistoryRequest);
protocols.set(272, MidImagineNotice);
protocols.set(273, MidRerollRequest);
protocols.set(274, MidSelectRequest);
protocols.set(300, BrokerRegisterAsk);
protocols.set(301, BrokerRegisterAnswer);
protocols.set(302, MidImagineAsk);
protocols.set(303, MidImagineNotify);
protocols.set(304, MidRerollAsk);
protocols.set(305, MidSelectAsk);
protocols.set(306, SeoAsk);
protocols.set(307, SdSimulateAsk);
protocols.set(308, SdSimulateAnswer);
protocols.set(309, SdSimulateNotify);
protocols.set(330, StableDiffusionRequest);
protocols.set(331, StableDiffusionResponse);
protocols.set(332, StableDiffusionParameters);
protocols.set(333, InterrogatorPromptRequest);
protocols.set(334, InterrogatorPromptResponse);
protocols.set(340, SdSimulateRequest);
protocols.set(341, SdSimulateNotice);
protocols.set(342, SdHistoryRequest);
protocols.set(343, SdSimulateResponse);
protocols.set(344, SdImage);
protocols.set(345, ImageDownloadRequest);
protocols.set(346, ImageDownloadResponse);
protocols.set(347, ImageDeleteAsk);
protocols.set(402, LlamaMessageAsk);
protocols.set(403, LlamaMessageNotify);

class ProtocolManager {
    static getProtocol(protocolId: number): any {
        const protocol = protocols.get(protocolId);
        if (protocol === null) {
            throw '[protocolId:' + protocolId + ']协议不存在';
        }
        return protocol;
    }

    static write(buffer: IByteBuffer, packet: any): void {
        const protocolId = packet.protocolId();
        buffer.writeShort(protocolId);
        const protocol = ProtocolManager.getProtocol(protocolId);
        protocol.write(buffer, packet);
    }

    static read(buffer: IByteBuffer): any {
        const protocolId = buffer.readShort();
        const protocol = ProtocolManager.getProtocol(protocolId);
        const packet = protocol.read(buffer);
        return packet;
    }
}

export default ProtocolManager;

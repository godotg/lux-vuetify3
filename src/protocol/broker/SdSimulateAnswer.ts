import SignalAttachment from '../attachment/SignalAttachment';
import SdSimulateResponse from '../sdiffusion/SdSimulateResponse';


class SdSimulateAnswer {

    noticeSid: number = 0;
    attachment: SignalAttachment | null = null;
    response: SdSimulateResponse | null = null;

    static PROTOCOL_ID: number = 308;

    protocolId(): number {
        return SdSimulateAnswer.PROTOCOL_ID;
    }

    static write(buffer: any, packet: SdSimulateAnswer | null) {
        if (buffer.writePacketFlag(packet) || packet == null) {
            return;
        }
        buffer.writePacket(packet.attachment, 0);
        buffer.writeLong(packet.noticeSid);
        buffer.writePacket(packet.response, 343);
    }

    static read(buffer: any): SdSimulateAnswer | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new SdSimulateAnswer();
        const result0 = buffer.readPacket(0);
        packet.attachment = result0;
        const result1 = buffer.readLong();
        packet.noticeSid = result1;
        const result2 = buffer.readPacket(343);
        packet.response = result2;
        return packet;
    }
}

export default SdSimulateAnswer;

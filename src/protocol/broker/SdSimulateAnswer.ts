import IByteBuffer from '../IByteBuffer';
import SignalAttachment from '../attachment/SignalAttachment';
import SdSimulateResponse from '../sdiffusion/SdSimulateResponse';

class SdSimulateAnswer {
    noticeSid: number = 0;
    attachment: SignalAttachment | null = null;
    response: SdSimulateResponse | null = null;

    static PROTOCOL_ID: number = 322;

    protocolId(): number {
        return SdSimulateAnswer.PROTOCOL_ID;
    }

    static write(buffer: IByteBuffer, packet: SdSimulateAnswer | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writePacket(packet.attachment, 0);
        buffer.writeLong(packet.noticeSid);
        buffer.writePacket(packet.response, 343);
    }

    static read(buffer: IByteBuffer): SdSimulateAnswer | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new SdSimulateAnswer();
        const result0 = buffer.readPacket(0);
        packet.attachment = result0;
        const result1 = buffer.readLong();
        packet.noticeSid = result1;
        const result2 = buffer.readPacket(343);
        packet.response = result2;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default SdSimulateAnswer;
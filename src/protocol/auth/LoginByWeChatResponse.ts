import IByteBuffer from '../IByteBuffer';

class LoginByWeChatResponse {
    authUrl: string = '';

    static PROTOCOL_ID: number = 256;

    protocolId(): number {
        return LoginByWeChatResponse.PROTOCOL_ID;
    }

    static write(buffer: IByteBuffer, packet: LoginByWeChatResponse | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writeString(packet.authUrl);
    }

    static read(buffer: IByteBuffer): LoginByWeChatResponse | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new LoginByWeChatResponse();
        const result0 = buffer.readString();
        packet.authUrl = result0;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default LoginByWeChatResponse;


class LoginByWeChatRequest {

    

    static PROTOCOL_ID: number = 255;

    protocolId(): number {
        return LoginByWeChatRequest.PROTOCOL_ID;
    }

    static write(buffer: any, packet: LoginByWeChatRequest | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
    }

    static read(buffer: any): LoginByWeChatRequest | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new LoginByWeChatRequest();
        
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default LoginByWeChatRequest;

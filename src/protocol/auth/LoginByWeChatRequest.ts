

class LoginByWeChatRequest {

    

    static PROTOCOL_ID: number = 255;

    protocolId(): number {
        return LoginByWeChatRequest.PROTOCOL_ID;
    }

    static write(buffer: any, packet: LoginByWeChatRequest | null) {
        if (buffer.writePacketFlag(packet) || packet == null) {
            return;
        }
        
    }

    static read(buffer: any): LoginByWeChatRequest | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new LoginByWeChatRequest();
        
        return packet;
    }
}

export default LoginByWeChatRequest;

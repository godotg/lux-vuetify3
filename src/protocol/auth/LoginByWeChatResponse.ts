

class LoginByWeChatResponse {

    authUrl: string = '';

    static PROTOCOL_ID: number = 256;

    protocolId(): number {
        return LoginByWeChatResponse.PROTOCOL_ID;
    }

    static write(buffer: any, packet: LoginByWeChatResponse | null) {
        if (buffer.writePacketFlag(packet) || packet == null) {
            return;
        }
        buffer.writeString(packet.authUrl);
    }

    static read(buffer: any): LoginByWeChatResponse | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new LoginByWeChatResponse();
        const result0 = buffer.readString();
        packet.authUrl = result0;
        return packet;
    }
}

export default LoginByWeChatResponse;

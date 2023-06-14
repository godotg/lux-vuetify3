

class Error {

    module: number = 0;
    errorCode: number = 0;
    errorMessage: string = '';

    static PROTOCOL_ID: number = 101;

    protocolId(): number {
        return Error.PROTOCOL_ID;
    }

    static write(buffer: any, packet: Error | null) {
        if (buffer.writePacketFlag(packet) || packet == null) {
            return;
        }
        buffer.writeInt(packet.errorCode);
        buffer.writeString(packet.errorMessage);
        buffer.writeInt(packet.module);
    }

    static read(buffer: any): Error | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new Error();
        const result0 = buffer.readInt();
        packet.errorCode = result0;
        const result1 = buffer.readString();
        packet.errorMessage = result1;
        const result2 = buffer.readInt();
        packet.module = result2;
        return packet;
    }
}

export default Error;

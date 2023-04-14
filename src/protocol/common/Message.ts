

class Message {

    module: number = 0;
    code: number = 0;
    message: string = '';

    static PROTOCOL_ID: number = 100

    protocolId(): number {
        return Message.PROTOCOL_ID;
    }

    static write(buffer: any, packet: Message | null) {
        if (buffer.writePacketFlag(packet)) {
            return;
        }
        if (packet === null) {
            return;
        }

        buffer.writeInt(packet.code);
        buffer.writeString(packet.message);
        buffer.writeByte(packet.module);
    }

    static read(buffer: any): Message | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new Message();
        const result0 = buffer.readInt();
        packet.code = result0;
        const result1 = buffer.readString();
        packet.message = result1;
        const result2 = buffer.readByte();
        packet.module = result2;
        return packet;
    }
}

export default Message;

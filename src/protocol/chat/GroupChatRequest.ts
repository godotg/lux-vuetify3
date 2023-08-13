

class GroupChatRequest {

    groupId: number = 0;
    // 0为普通聊天，1为Stable Diffusion，2为Midjourney
    type: number = 0;
    message: string = '';

    static PROTOCOL_ID: number = 242;

    protocolId(): number {
        return GroupChatRequest.PROTOCOL_ID;
    }

    static write(buffer: any, packet: GroupChatRequest | null) {
        if (buffer.writePacketFlag(packet) || packet == null) {
            return;
        }
        buffer.writeLong(packet.groupId);
        buffer.writeString(packet.message);
        buffer.writeByte(packet.type);
    }

    static read(buffer: any): GroupChatRequest | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new GroupChatRequest();
        const result0 = buffer.readLong();
        packet.groupId = result0;
        const result1 = buffer.readString();
        packet.message = result1;
        const result2 = buffer.readByte();
        packet.type = result2;
        return packet;
    }
}

export default GroupChatRequest;

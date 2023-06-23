

class MidImagineNotice {

    // provider为加入到了providers队列，consumer为开始消费任务，create为创建消息，update为更新消息，complete为创建完成，stop为发生错误停止生成
    type: string = '';
    nonce: string = '';
    content: string = '';
    // 只有type为complete状态才能够访问图片
    imageUrl: string = '';
    // 只有type为update状态才有意义
    progress: string = '';

    static PROTOCOL_ID: number = 271;

    protocolId(): number {
        return MidImagineNotice.PROTOCOL_ID;
    }

    static write(buffer: any, packet: MidImagineNotice | null) {
        if (buffer.writePacketFlag(packet) || packet == null) {
            return;
        }
        buffer.writeString(packet.content);
        buffer.writeString(packet.imageUrl);
        buffer.writeString(packet.nonce);
        buffer.writeString(packet.progress);
        buffer.writeString(packet.type);
    }

    static read(buffer: any): MidImagineNotice | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new MidImagineNotice();
        const result0 = buffer.readString();
        packet.content = result0;
        const result1 = buffer.readString();
        packet.imageUrl = result1;
        const result2 = buffer.readString();
        packet.nonce = result2;
        const result3 = buffer.readString();
        packet.progress = result3;
        const result4 = buffer.readString();
        packet.type = result4;
        return packet;
    }
}

export default MidImagineNotice;

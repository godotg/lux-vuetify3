import NewsStock from './NewsStock';
import NewsIndustry from './NewsIndustry';


class News {

    id: number = 0;
    level: string = '';
    title: string = '';
    content: string = '';
    ctime: string = '';
    stocks: Array<fun.jiucai.common.packet.news.NewsStock> = [];
    industries: Array<fun.jiucai.common.packet.news.NewsIndustry> = [];
    subjects: Array<string> = [];

    static PROTOCOL_ID: number = 200;

    protocolId(): number {
        return News.PROTOCOL_ID;
    }

    static write(buffer: any, packet: News | null) {
        if (buffer.writePacketFlag(packet) || packet == null) {
            return;
        }
        buffer.writeString(packet.content);
        buffer.writeString(packet.ctime);
        buffer.writeLong(packet.id);
        buffer.writePacketList(packet.industries, 202);
        buffer.writeString(packet.level);
        buffer.writePacketList(packet.stocks, 201);
        buffer.writeStringList(packet.subjects);
        buffer.writeString(packet.title);
    }

    static read(buffer: any): News | null {
        if (!buffer.readBoolean()) {
            return null;
        }
        const packet = new News();
        const result0 = buffer.readString();
        packet.content = result0;
        const result1 = buffer.readString();
        packet.ctime = result1;
        const result2 = buffer.readLong();
        packet.id = result2;
        const list3 = buffer.readPacketList(202);
        packet.industries = list3;
        const result4 = buffer.readString();
        packet.level = result4;
        const list5 = buffer.readPacketList(201);
        packet.stocks = list5;
        const list6 = buffer.readStringList();
        packet.subjects = list6;
        const result7 = buffer.readString();
        packet.title = result7;
        return packet;
    }
}

export default News;

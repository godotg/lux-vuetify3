import IByteBuffer from '../IByteBuffer';
import IProtocolRegistration from '../IProtocolRegistration';


class Market {
    date: number = 0;
    stockNum: number = 0;
    stockNum0: number = 0;
    stockNumNeg005: number = 0;
    stockNumNeg10: number = 0;
    totalPrice: number = 0;
    exchange: number = 0;
    amount: number = 0;
    shAmount: number = 0;
    kcAmount: number = 0;
    szAmount: number = 0;
    cyAmount: number = 0;
    bjAmount: number = 0;
}

export class MarketRegistration implements IProtocolRegistration<Market> {
    protocolId(): number {
        return 210;
    }

    write(buffer: IByteBuffer, packet: Market | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
        buffer.writeLong(packet.amount);
        buffer.writeLong(packet.bjAmount);
        buffer.writeLong(packet.cyAmount);
        buffer.writeLong(packet.date);
        buffer.writeLong(packet.exchange);
        buffer.writeLong(packet.kcAmount);
        buffer.writeLong(packet.shAmount);
        buffer.writeInt(packet.stockNum);
        buffer.writeInt(packet.stockNum0);
        buffer.writeInt(packet.stockNumNeg005);
        buffer.writeInt(packet.stockNumNeg10);
        buffer.writeLong(packet.szAmount);
        buffer.writeLong(packet.totalPrice);
    }

    read(buffer: IByteBuffer): Market | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new Market();
        const result0 = buffer.readLong();
        packet.amount = result0;
        const result1 = buffer.readLong();
        packet.bjAmount = result1;
        const result2 = buffer.readLong();
        packet.cyAmount = result2;
        const result3 = buffer.readLong();
        packet.date = result3;
        const result4 = buffer.readLong();
        packet.exchange = result4;
        const result5 = buffer.readLong();
        packet.kcAmount = result5;
        const result6 = buffer.readLong();
        packet.shAmount = result6;
        const result7 = buffer.readInt();
        packet.stockNum = result7;
        const result8 = buffer.readInt();
        packet.stockNum0 = result8;
        const result9 = buffer.readInt();
        packet.stockNumNeg005 = result9;
        const result10 = buffer.readInt();
        packet.stockNumNeg10 = result10;
        const result11 = buffer.readLong();
        packet.szAmount = result11;
        const result12 = buffer.readLong();
        packet.totalPrice = result12;
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default Market;
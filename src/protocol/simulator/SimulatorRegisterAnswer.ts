import IByteBuffer from '../IByteBuffer';


class SimulatorRegisterAnswer {

    

    static PROTOCOL_ID: number = 1001;

    protocolId(): number {
        return SimulatorRegisterAnswer.PROTOCOL_ID;
    }

    static write(buffer: IByteBuffer, packet: SimulatorRegisterAnswer | null) {
        if (packet === null) {
            buffer.writeInt(0);
            return;
        }
        buffer.writeInt(-1);
    }

    static read(buffer: IByteBuffer): SimulatorRegisterAnswer | null {
        const length = buffer.readInt();
        if (length === 0) {
            return null;
        }
        const beforeReadIndex = buffer.getReadOffset();
        const packet = new SimulatorRegisterAnswer();
        
        if (length > 0) {
            buffer.setReadOffset(beforeReadIndex + length);
        }
        return packet;
    }
}

export default SimulatorRegisterAnswer;

class RecoveryQueue extends Map {
    addRecoveryFor(datagram) {
        this.set(datagram.sequenceNumber, datagram);
    }

    isRecoverable(seqNumber) {
        return this.has(seqNumber);
    }

    recover(sequenceNumbers) {
        let datagrams = [];

        sequenceNumbers.forEach(seqNumber => {
            if (this.isRecoverable(seqNumber)) {
                datagrams.push(this.get(seqNumber));
            }
        });

        return datagrams;
    }

    remove(seqNumber) {
        this.delete(seqNumber);
    }

    isEmpty() {
        return this.size === 0;
    }
}

module.exports = RecoveryQueue;
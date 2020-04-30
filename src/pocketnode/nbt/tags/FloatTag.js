const Tag = pocketnode("/nbt/tags/Tag.js");

class FloatTag extends Tag {
  constructor(buffer) {
    super(buffer);
    this.setPayload();
    super.setChild();
  }

  setPayload() {
    let buffer = super.getBuffer();

    if (buffer instanceof Array) {
      var floatLength = 4;
      var payload = "";

      for (var i = 0; i < floatLength; i++) {
        payload += buffer.shift();
      }

      super.setPayloadContent(payload);
    }
  }

}

module.exports = FloatTag;
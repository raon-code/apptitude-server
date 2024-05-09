class CommonTemplate {
  constructor(code, value, additionalData) {
    this.code = code;
    this.value = value;
    this.additionalData = additionalData;
  }

  getCode() {
    return this.code;
  }

  getValue() {
    return this.value;
  }

  getAdditionalData() {
    return this.additionalData;
  }
}

module.exports = CommonTemplate;

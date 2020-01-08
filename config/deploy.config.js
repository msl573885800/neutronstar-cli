const config = {
  "prod": {
    "oss": {
      "region": "oss-cn-shenzhen",
      "accessKeyId": "LTAI61XzZNdUzZYM",
      "accessKeySecret": "uwKDgm4bl9bu8ioJMTRWNk8AajAaNG",
      "bucket": "smartpoints-cdn",
    },
    "server": {
      "host": "47.112.196.158",
      "username": "smartpoints_web",
      "password": "smartpoints_upload#123",
    }
  },
  "test": {
    "oss": {
      "region": "oss-cn-shenzhen",
      "accessKeyId": "LTAI61XzZNdUzZYM",
      "accessKeySecret": "uwKDgm4bl9bu8ioJMTRWNk8AajAaNG",
      "bucket": "test-smartpoints-cdn",
    },
    "server": {
      "host": "47.107.96.97",
      "username": "root",
      "password": "Tokenomy2018#Ali",
    }
  }
}

module.exports = config;

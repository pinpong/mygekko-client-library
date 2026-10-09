## [0.3.0](https://github.com/pinpong/mygekko-client-library/compare/v0.2.0...v0.3.0) (2026-10-09)

### ✨ Features

* expose the units of weather values ([313fa9e](https://github.com/pinpong/mygekko-client-library/commit/313fa9e7ad8fecea874d414fd25788e88b13e9b4))

### 🐛 Bug Fixes

* encode the credentials in the request url ([aa79cb2](https://github.com/pinpong/mygekko-client-library/commit/aa79cb2316cfeb2620ddbdf1cd91ba8fe4d8072a))
* validate item ids against the system config ([7371b36](https://github.com/pinpong/mygekko-client-library/commit/7371b36ae2464b589124fce0a86c9b772a2e4a14))

## [0.2.0](https://github.com/pinpong/mygekko-client-library/compare/v0.1.3...v0.2.0) (2026-10-09)

### ✨ Features

* add a combined client that falls back from the local to the remote api ([770b00a](https://github.com/pinpong/mygekko-client-library/commit/770b00a61b0d3e07b9ac628c28a42382dd79fb54))
* add reading the groups of a system ([2fcf2b9](https://github.com/pinpong/mygekko-client-library/commit/2fcf2b9f263d5d1bb77efb57973934fc7d03e1b4))
* add request timeouts, repeat status requests and report connection errors ([6922819](https://github.com/pinpong/mygekko-client-library/commit/69228195886ab27424631db751f2f41ce464ed5c))
* add toggle, period reset, set point and user history commands ([0b3760f](https://github.com/pinpong/mygekko-client-library/commit/0b3760fd49fb9dd3ba4cef925c2ac32fea1c43e4))
* add wall box partial charge and user login commands and the air conditioner temperature ([51a57df](https://github.com/pinpong/mygekko-client-library/commit/51a57dff8ccbc26715be19e348b4a8fe45af0d44))
* add working modes and supported command checks to the systems ([f8b2d98](https://github.com/pinpong/mygekko-client-library/commit/f8b2d986527354372d0fdf3dc902c127269b7633))
* make request timeout and attempts configurable and list supported systems ([922493a](https://github.com/pinpong/mygekko-client-library/commit/922493a500edaa0dd46076daa6081f11b661471d))
* **pools:** add working mode and filter cleaning commands ([8eaceb8](https://github.com/pinpong/mygekko-client-library/commit/8eaceb85cb2880cf7b4f2b5e50423fa133c944fe))

### 🐛 Bug Fixes

* align access state, alarm zones, dim level, ems state and config checks with the device ([76e8c6a](https://github.com/pinpong/mygekko-client-library/commit/76e8c6aee15cc65fd0cd117254b5bb84fb0c7283))
* align action commands and the wall box charging energy with the app ([a309ff6](https://github.com/pinpong/mygekko-client-library/commit/a309ff610070d8cdec53497368bf7f11a21f3158))
* check trends against the trend config and walk the full config path ([caf4acb](https://github.com/pinpong/mygekko-client-library/commit/caf4acb22e708780e89ce9a8e614a6940e12fc9a))
* correct room temperature, alarm system and stove enum values ([1d2c650](https://github.com/pinpong/mygekko-client-library/commit/1d2c650f4df3933cd06394756ad8bcd167b411c3))
* correct the spelling of the too many request error code ([1cddc90](https://github.com/pinpong/mygekko-client-library/commit/1cddc90aefca4760203e4ff47c164ea3175d9c48))
* handle groups without a status value, weather trends without a config and inherited config keys ([72c49da](https://github.com/pinpong/mygekko-client-library/commit/72c49da73d646afeffb9b5662565dc7753ba6a4a))
* keep the client uninitialized if the trend config cannot be loaded ([6741975](https://github.com/pinpong/mygekko-client-library/commit/6741975c043c230855475d66f1d1b7d3a8b36b5d))
* keep the last status value without a trailing semicolon ([ad80d19](https://github.com/pinpong/mygekko-client-library/commit/ad80d19cf8e92c697fcdd365dd0b5e87e0ba407a))
* parse seven-value heating circuits and the wall box charge duration ([6636c78](https://github.com/pinpong/mygekko-client-library/commit/6636c78c70b61967acaa0936f56c00f97199967b))
* read the status like the app ([a49a5a7](https://github.com/pinpong/mygekko-client-library/commit/a49a5a7314cf7e043cd092fdd4bb4aa860756b01))
* read the status values at the positions the device reports ([1a1fe1e](https://github.com/pinpong/mygekko-client-library/commit/1a1fe1e8abf96b4bb52c53eed35fae3b09df30fe))
* reject a vent level the device does not know ([5d05941](https://github.com/pinpong/mygekko-client-library/commit/5d0594106030bc1eff4d241c4833eea56290e4d1))
* request the own status in weather, gekko info and global alarm ([dfad7a2](https://github.com/pinpong/mygekko-client-library/commit/dfad7a231021058535b9dd4dcb25d0d05e8147ce))
* return null for blank status values ([e7f4940](https://github.com/pinpong/mygekko-client-library/commit/e7f49407d7b0466d89011edc663ac699e009b546))
* return null for items without a page ([b1edeef](https://github.com/pinpong/mygekko-client-library/commit/b1edeef69ac3a5b856cd0b12b89b06d2b9f67462))
* return null for text values missing in the status ([f8bc10b](https://github.com/pinpong/mygekko-client-library/commit/f8bc10b574fdb794c3a799aa2c9f30fbb9a37ca7))
* return null for values missing in the status of the global systems ([d26852f](https://github.com/pinpong/mygekko-client-library/commit/d26852ff81bd491a4976573cee9d028b9613a491))
* round command values to one decimal ([e97bc66](https://github.com/pinpong/mygekko-client-library/commit/e97bc669634a81f14643dd3b5c572fef9a3f0400))
* send the command values of the app for sms and email and wall box charging ([22b4ad7](https://github.com/pinpong/mygekko-client-library/commit/22b4ad766cd5d650cd742c44c6b53ef20c42a860))
* throw a client error for every failure ([6633b3b](https://github.com/pinpong/mygekko-client-library/commit/6633b3b6acfe19948c3ddd755b2d680bd10ebdfc))
* **wallboxes:** read the user totals from the item status ([bb2580a](https://github.com/pinpong/mygekko-client-library/commit/bb2580a146c18fc7391080fd305c659de78504ee))

### 🔄 Code Refactors

* correct the spelling of temperature in the command names ([12ff28a](https://github.com/pinpong/mygekko-client-library/commit/12ff28a0265b6b18b71ac407badaa668f1fe6f85))
* name the systems a device has only once in the singular ([297c996](https://github.com/pinpong/mygekko-client-library/commit/297c99656a435983d6c9556d2b2d1c7ab8502627))
* **types:** type the device config and status responses ([8c33eeb](https://github.com/pinpong/mygekko-client-library/commit/8c33eebee6734c865314b3b6292ca25465f9099d))

### 📚 Documentation

* describe the combined client, request options, groups and helpers ([05e5496](https://github.com/pinpong/mygekko-client-library/commit/05e5496da2461b0d99dba8c6ec06a3d53c1aa4ae))
* state ranges, units and meanings of command values and status fields ([f326db3](https://github.com/pinpong/mygekko-client-library/commit/f326db3ec0dd3b4bf6b56eb87ae5e19f2a89390a))

### 🛠️ Other changes

* **deps:** refresh transitive dependencies in the lockfile ([15e4b4b](https://github.com/pinpong/mygekko-client-library/commit/15e4b4b24839db978d86cc59598b3c7a25c0dc75))

## [0.1.3](https://github.com/pinpong/mygekko-client-library/compare/v0.1.2...v0.1.3) (2026-10-09)

### 🐛 Bug Fixes

* **deps:** upgrade axios to 1.20.0 ([73072d5](https://github.com/pinpong/mygekko-client-library/commit/73072d5b7417c1731206e758c678c76b9b7302a9))

### 📚 Documentation

* point lint badge to code check workflow ([34c646c](https://github.com/pinpong/mygekko-client-library/commit/34c646cffc1585ad874e687f802ac32ee9a8a11c))

### 🛠️ Other changes

* **deps:** upgrade eslint to 10 ([d8ed29b](https://github.com/pinpong/mygekko-client-library/commit/d8ed29beb0086b97244e0ea63c150e71d9998d6c))
* **deps:** upgrade eslint to 9 and migrate to flat config ([1a81073](https://github.com/pinpong/mygekko-client-library/commit/1a81073e79b7a2851e35cc9d0fa4ed8730b5203f))
* **deps:** upgrade typescript, jest, prettier and typedoc ([decbd53](https://github.com/pinpong/mygekko-client-library/commit/decbd534c79f160a9df8621d4aa55e84661cb412))
* **lint:** remove import order rule already enforced by prettier ([31ce994](https://github.com/pinpong/mygekko-client-library/commit/31ce994abf7a6f1a3a909e68c9ca69b3cda4a92a))
* replace husky with lefthook and add commitlint ([ee13fb3](https://github.com/pinpong/mygekko-client-library/commit/ee13fb3f3c810b4ac66c5fd988e0d3e0193a34df))

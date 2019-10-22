module.exports = (api, options, rootOptions) => {
    // 复制并用 ejs 渲染 `./template` 内所有的文件
    api.render('../template')
    // 修改 `package.json` 里的字段
    api.extendPackage({
      "scripts": {
        "dev": "vue-cli-service serve",
        "test": "vue-cli-service serve --mode test",
        "build": "vue-cli-service build",
        "dev-build": "vue-cli-service build --mode development",
        "lint": "vue-cli-service lint"
      },
      "dependencies": {
        "accounting": "^0.4.1",
        "axios": "^0.19.0",
        "babel-polyfill": "^6.26.0",
        "core-js": "^3.1.2",
        "element-ui": "^2.12.0",
        "lodash-es": "^4.17.15",
        "moment": "^2.24.0",
        "register-service-worker": "^1.6.2",
        "vue": "^2.6.10",
        "vue-router": "^3.0.6",
        "vuex": "^3.0.1"
      },
      "devDependencies": {
        "@vue/cli-plugin-babel": "^4.0.0",
        "@vue/cli-plugin-eslint": "^4.0.0",
        "@vue/cli-plugin-pwa": "^4.0.0",
        "@vue/cli-service": "^4.0.0",
        "@vue/eslint-config-standard": "^4.0.0",
        "babel-eslint": "^10.0.1",
        "babel-plugin-component": "^1.1.1",
        "eslint": "^5.16.0",
        "eslint-plugin-vue": "^5.0.0",
        "less": "^3.0.4",
        "less-loader": "^5.0.0",
        "node-sass": "^4.12.0",
        "sass-loader": "^8.0.0",
        "vue-template-compiler": "^2.6.10"
      }
    })
}

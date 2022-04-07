const fs = require('fs');
const path = require('path');
const prettier = require('prettier');
const config = require('./config.js');
const prettierJson = require('../../.prettierrc.js');

const renderUsageStr = (compStrMap) => `<!-- 该脚本为自动生成，如有需要请在 /script/generate-usage/index.js 中调整 -->
<template>
  <base-usage :code="renderCode" :config-list="configList">
    <template #default="data">
      <component :is="renderComp(data)" />
    </template>
  </base-usage>
</template>

<script setup lang="jsx">
/* eslint-disable */
import { compile } from 'vue/dist/vue.esm-bundler.js';
${compStrMap.importStr || ''}
import configList from './props.json';
const renderCode = \`${compStrMap.renderCode}\`;

const renderComp = (data) => {
  return data?.usageCode ? compile(data.usageCode) : null;
};
</script>
`;
// 自动化生成 live demo 脚本
function genUsage() {
  // eslint-disable-next-line no-restricted-syntax
  for (const name of Object.keys(config)) {
    const fileFolderPath = path.resolve(__dirname, `../../examples/${name}/usage`);
    if (!fs.existsSync(fileFolderPath)) {
      fs.mkdirSync(fileFolderPath);
    }

    try {
      const data = renderUsageStr(config[name]);
      const filePath = path.resolve(__dirname, `../../examples/${name}/usage/index.vue`);
      fs.writeFileSync(filePath, codeFormat(data));
    } catch (err) {
      console.error(`${name} usage 组件生成失败...`, err);
    }
    console.log(`${name} usage 组件生成成功...`);
  }
}

// 格式化vue代码
function codeFormat(code, options = {}) {
  return prettier.format(code, {
    ...prettierJson,
    parser: 'vue',
    ...options,
  });
}

genUsage();

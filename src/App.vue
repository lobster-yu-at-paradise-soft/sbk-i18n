<template>
  <h1>繁簡語言設定檔生成器</h1>
  <div class="wrapper">
    <div class="column">
      <dt>繁中</dt>
      <dd>
        <textarea v-model="tt"></textarea>
      </dd>
    </div>
    <div class="column">
      <dt>简中</dt>
      <dd>
        <textarea v-model="st"></textarea>
      </dd>
    </div>
    <dl class="column">
      <dt>PINYIN</dt>
      <dd>
        <textarea v-model="py" readonly></textarea>
      </dd>
    </dl>
    <div class="output">
<pre>{{ result }}</pre>
      <div class="action">
        <button class="primary" type="button" @click="copy" :disabled="copyStatus">
          {{ (copyStatus) ? 'Copied!!' : 'Copy result' }}
        </button>
      </div>
    </div>
  </div> 
  <footer>copyright &copy; Lobster</footer>
</template>

<script setup>
  import pinyin from 'pinyin'
  import {tify, sify} from 'chinese-conv'
  import { copyText } from 'vue3-clipboard'
  import { ref, reactive, watch } from 'vue'

  const tt = ref(''),
        st = ref(''),
        py = ref(''),
        result = ref(''),
        copyStatus = ref(false),
        json = reactive({})

  const strToArr = (str) => {
    return str.split(/\n/g).filter(s => s!== '')
  }

  const transToPinyin = (val) => {
    Object.keys(json).map(key => {
      delete json[key]
    })
    const arr = strToArr(val)
    const result = arr.map(el => pinyin(el, {
      style: 'normal' 
    })).map(t => t.flat(1).join(' '))
    py.value = result.join('\n')
  }  

  const copy = () => {
    copyText(result.value, undefined, (err) => {
      if (err) {
        console.log(err)
      } else {
        copyStatus.value = true
        const timer = setTimeout(() => {
          copyStatus.value = false
          clearTimeout(timer)
        }, 800)
      }
    })
  }

  watch(tt, val => {
    st.value = sify(val)
    //transToPinyin(val)
  })
  watch(st, val => {
    tt.value = tify(val)
    transToPinyin(val)
  })
  watch(py, val => {
    const stArr = strToArr(st.value)
    const pyArr = strToArr(val)

    pyArr.forEach((el, i) => {
      const key = el.replace(/\s/g, '-') 
      json[key] = stArr[i]
    });
    output()
  })

  const output = () => {
    result.value = JSON.stringify(json)
      .replace(/{|}/g, '')
      .replace(/,/g, ',\n')
      .replace(/"/g, '\'')
      .replace(/:/g, ': ')
  }
</script>

<style>
  html, body {
    height: 100%;
    margin: 0;
    padding: 0;
  }

  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }
  dl, dt, dd {
    margin: 0;
    padding: 0;
  }
  * {
    box-sizing: border-box;
  }
  .wrapper {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    width: 800px;
  }
  h1 {
    text-align: center;
  }
  footer {
    font-size: .75em;
    padding: 1em;
    color: #888;
  }
  .column {
    flex: 0 0 32.5%;
    box-sizing: border-box;
  }
  .output {
    padding: 1em;
    background-color: #EEE;
    flex: 1 1 100%;
    margin-top: .8em;
    border-radius: .3em;
    text-align: left;
    display: flex;
    justify-content: space-between;
  }
  pre {
    margin: 0;
  }
  textarea {
    height: 20em;
    display: block;
    width: 100%;
    border: 1px solid #CCC;
    border-radius: .3em;
    resize: none;
    padding: .5em;
  }
  textarea:active {
    outline: 2px solid #333;
  }
  button {
    border: none;
    background: none;
    outline: none;
    border-radius: .3rem;
    padding: .75em;
    cursor: pointer;
    transition: background .3s;
  }
  button.primary {
    background-color: #333;
    color: #FFF;
    width: 88px;
  }
  button.primary[disabled] {
    background-color: #666;
  }
  button.primary:hover {
    background-color: #444;
  }
  button.primary:active {
    background-color: #222;
    outline: 2px solid rgba(0, 0, 0, .1);
  }
</style>

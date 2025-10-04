/*
 * @Author: daidai
 * @Date: 2022-01-12 14:05:56
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-08-07 17:12:07
 * @FilePath: \web-pc\src\pages\big-screen\main.js
 */
import Vue from "vue";
import App from "./App.vue";
import router from './router'
import store from './store'
import { loading, borderBox13, digitalFlop, capsuleChart, borderBox8, borderBox12, borderBox6, decoration12, borderBox11, borderBox4, borderBox10 } from '@jiaminghi/data-view'
import { Radio, Button, RadioGroup, Image, Icon, Row, Col, Card } from 'element-ui'
import Echart from './components/echart/index.vue'
import ItemWrap from './components/item-wrap/item-wrap.vue'
import ItemWrap2 from './components/item-wrap/item-wrap2.vue'
import ItemWrap6 from './components/item-wrap/item-wrap6.vue'
import ItemWrap8 from './components/item-wrap/item-wrap8.vue'
import ItemWrap11 from './components/item-wrap/item-wrap11.vue'
import ItemWrap4 from './components/item-wrap/item-wrap4.vue'
import ItemWrap10 from './components/item-wrap/item-wrap10.vue'
import Message from './components/message/message.vue'
import Reacquire from './components/reacquire/reacquire.vue'
import Messages from './components/message/message'
import "vue-easytable/libs/theme-default/index.css";
import '@/assets/css/public.scss'
import "@/assets/css/index.scss"


import * as filters from '@/directives/filters'

require('./mock/mock')//是否使用mock
Vue.config.productionTip = false;

// 自定义组件
Vue.component("Echart", Echart)
Vue.component("ItemWrap", ItemWrap)
Vue.component("ItemWrap2", ItemWrap2)
Vue.component("ItemWrap6", ItemWrap6)
Vue.component("ItemWrap8", ItemWrap8)
Vue.component("ItemWrap11", ItemWrap11)
Vue.component("ItemWrap4", ItemWrap4)
Vue.component("ItemWrap10", ItemWrap10)
Vue.component("Message", Message)
Vue.component("Reacquire", Reacquire)
Vue.prototype.$Message = Messages
// element组件
Vue.use(Radio);
Vue.use(Button);
Vue.use(RadioGroup);
Vue.use(Image)
Vue.use(Icon)
Vue.use(Row)
Vue.use(Col)
Vue.use(Card)

// datav组件
Vue.use(loading)
Vue.use(borderBox13)
Vue.use(borderBox8)
Vue.use(digitalFlop)
Vue.use(capsuleChart)
Vue.use(borderBox12)
Vue.use(borderBox6)
Vue.use(decoration12)
Vue.use(borderBox11)
Vue.use(borderBox4)
Vue.use(borderBox10)
// 全局数据过滤器
Object.keys(filters).forEach(k => Vue.filter(k, filters[k]));
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app");
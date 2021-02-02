import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'workbench',
      component: require('@/pages/workbench').default
    },
    {
      path: '/ocr',
      name: 'ocr',
      component: require('@/pages/ocr/index').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})

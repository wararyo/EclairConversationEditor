import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'editor',
      component: require('@/components/Editor').default
    },
    {
      path: '/viewer',
      name: 'viewer',
      component: require('@/components/Viewer').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})

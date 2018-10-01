import Vue from 'vue';
import VcInstance from '../vc-instance/index';
import { getUid } from '../utils/utils';

export default (options = {}, wrapper) => {

	let isNeedWaiting = false;
	let { cName = wrapper.name, onBefore, el, root: _root } = options;

	if (!cName) {
		console.log('传送门：cName 必传');
		return;
	}

	if (!wrapper) {
		console.log('传送门：目标组件必传');
		return;
	}

	class Statics {
		static init(opts = {}) {
			return new Promise((resolve, reject) => {
				let container = document.createElement(el || 'div');
				let target = document.querySelector(_root || 'body');

				// init opts
				const { 
					getInstance, 
					onBefore: _onBefore, 
					cName: _cName,
					store,
					router,
					parent = {}, // 依赖注入使用 like store, router, Life cycle，methods, mixins, ....
					...rest
				} = opts;

				onBefore = _onBefore || onBefore;
				cName = _cName || cName;

				let render = (res = {}) => {
					// destory
					VcInstance.APIS[cName] && VcInstance.APIS[cName].$emit('destory');

					const VueComponent = Vue.extend(wrapper);
					let vm;
					vm = new VueComponent({
						el: container,
						store, // vuex,
						router, // vue-router
						...parent,
						propsData: {
							...opts,
							data: res.data
						}
					});

					vm.$on('destory', (res) => {
						vm.$destroy();
						// 主动卸载节点
						target.removeChild(vm.$el);
						delete VcInstance.APIS[cName];
					});

					vm.$on('close', (res) => {
						vm.emit('destory');
						reject(res);
					});

					vm.$on('sure', (res) => {
						vm.emit('destory');
						resolve(res);
					});

					// 回调vm实例
					getInstance && getInstance(vm);

					// 标记
					VcInstance.APIS[cName] = vm;

					// 插入	
					target.appendChild(vm.$el);
				};

				if (onBefore) {
					if (isNeedWaiting) {
						container = null;
						opts = null;
						render = null;
					} else {
						isNeedWaiting = true;
						onBefore({ ...opts })
							.then((res = {}) => {
								render(res);
							}).catch((res = {}) => {
								isNeedWaiting = false;
								reject(res);
							});
					}
					return;
				}
				isNeedWaiting = false;
				render();
			});
		}

		/**
		 * 弹出项目，验证数据结构是否合法
		 * opts {
		 * 	store,
		 * 	router,
		 * 	getInstance,
		 * 	param: {
		 * 	}
		 * }
		 */
		static popup(opts = {}) {
			if (typeof opts !== 'object') {
				opts = {};
			}
			return Statics.init(opts);
		}
	}

	return Statics;
};



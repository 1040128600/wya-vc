<template>
	<div class="vcm-picker-basic" style="height: 100%; overflow: auto;">
		<!-- 使用v-model -->
		<vcm-picker
			v-model="value"
			:data-source="dataSource" 
			:cascade="true" 
			:cols="3"
			@change="handleChange" 
		/>
		<br>
		<br>
		<br>
		<!-- 不使用v-model -->
		<vcm-picker
			:data-source="dataSource" 
			:cascade="true" 
			:cols="3" 
		/>
		<br>
		<br>
		<br>
		<!-- 自定义展示 -->
		<vcm-picker
			v-model="valueAsync" 
			:data-source="dataAsyncSource" 
			:cascade="true"
			:cols="3"
			:load-data="loadData"
		>
			<template #default="it">
				<h2>
					{{ it.label }}
				</h2>
			</template>
		</vcm-picker>
		<br>
		<br>
		<vcm-picker
			v-model="value"
			:data-source="dataAsyncSource1" 
			:cascade="true" 
			:cols="3" 
		/>
		<br>
		<!-- 非联动选择 -->
		<vcm-picker
			v-model="valueSeasons" 
			:data-source="dataSeasons" 
			:cascade="false"
			:cols="2"
			extra="非联动选择"
		/>
		<br>
		<br>
		<br>
		<h3 @click="handleClick">
			点击直接调用(空数据)
		</h3>
		<h3 @click="handleClick1">
			点击直接调用（默认数据）
		</h3>
		<br>
		<br>
		<br>
		<!-- 表单 -->
		<h2>表单</h2>
		<vcm-form
			ref="form"
			:show-message="true"
			:model="formValidate" 
			:rules="ruleValidate"
			@submit.native.prevent
		>
			<vcm-form-item prop="addr" label="选择">
				<vcm-picker
					v-model="formValidate.addr" 
					:data-source="dataSource" 
					:cascade="true" 
					:cols="3"
				/>
			</vcm-form-item>
			<vcm-form-item>
				<vcm-button @click="handleSubmit">
					提交表单
				</vcm-button>
			</vcm-form-item>
		</vcm-form>

		<vcm-picker-view 
			v-model="formValidate.addr" 
			:data-source="dataSource" 
			:cascade="true" 
			:cols="3"
		/>
		<br>
		<br>
		<br>
		<br>
		<br>
		<br>
		<br>
		<br>
		<br>
	</div>
</template>
<script>
import { cloneDeep } from 'lodash';
import Form from '../../form/index.m';
import MToast from '../../toast/index.m';
import Button from '../../button/index.m';
import MPicker from '../index.m';
import { cascadeData, seasons } from './basic/mock';

export default {
	name: "vcm-picker-basic",
	components: {
		'vcm-picker': MPicker,
		'vcm-picker-view': MPicker.View,
		'vcm-form': Form,
		'vcm-form-item': Form.Item,
		'vcm-button': Button,
	},
	data() {
		return {
			show: false,
			dataSource: cloneDeep(cascadeData),
			dataAsyncSource: [],
			dataAsyncSource1: [],
			value: ["330000", "330100", "330105"],
			valueAsync: ["330000", "330100", "330105"],
			valueView: ["330000", "330100", "330105"],
			valueSeasons: [],
			dataSeasons: cloneDeep(seasons),

			formValidate: {
				addr: [],
			},
			ruleValidate: {
				addr: [
					{ 
						required: true, 
						type: 'array', 
						message: '请选择地址', 
						trigger: 'change' 
					}
				],
			}
		};
	},
	computed: {
	},
	mounted() {
		setTimeout(() => {
			this.dataAsyncSource1 = cloneDeep(cascadeData);
		}, 3000);
	},
	methods: {
		loadData() {
			MToast.info('异步加载中');
			return new Promise((resolve, reject) => {
				setTimeout(() => {
					this.dataAsyncSource = cloneDeep(cascadeData);
					resolve();
				}, 3000);
			});
		},
		handleClick() {
			MPicker.open({
				dataSource: cloneDeep(cascadeData),
				value: [],
				cols: 3,
				title: '222',
				onOk: (value, label) => {
					MToast.info(label.join(','));
				},
				onCancel: () => {
					MToast.info('value');
				}
			});
		},
		handleClick1() {
			MPicker.open({
				dataSource: cloneDeep(cascadeData),
				value: ["330000", "330100", "330105"],
				cols: 3,
				onOk: (value, label) => {
					MToast.info(label.join(','));
				},
				onCancel: () => {
					MToast.info('value');
				}
			});
		},
		handleChange(value, label, selectData) {
			console.log(value, label, selectData);
		},
		handleSubmit(name) {
			this.$refs.form.validate()
				.then(() => {
					MToast.info('Success!');
				}).catch(() => {

				});
		},
	},
};

</script>
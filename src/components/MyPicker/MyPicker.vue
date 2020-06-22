/**
*@author leo
*@dateTime 2018/8/15
*@description created
*/
<template>
  <div class="picker-wrapper">
          <!-- <div class="van-picker-mask"  v-if="show" @click="onPickerCancel"></div>
          <van-picker class="my-picker"
                      v-if="show"
                      show-toolbar
                      :columns="pickerColumns"
                      @cancel="onPickerCancel"
                      @confirm="onPickerConfirm"
          /> -->
          <picker
            mode="selector"
            @change="onPickerConfirm"
            @cancel="onPickerCancel"
            :value="index"
            :range="pickerColumns"
          >{{pickerColumns[index]}}</picker>

  </div>
</template>
<script>
  
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    pickerColumns: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data () {
    return {
      index: 3
    }
  },
  methods: {
    onPickerCancel() {
      this.$emit("cancel");
    },
    onPickerConfirm(e) {
      this.index = e.mp.detail.value;
    }  
  }
}
</script>

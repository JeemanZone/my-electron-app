Vue.component('block-viewer', {
    props: ['node'],
    template: '#block-viewer',
    data: function() {
        return {
          block: this.node, 
          showChildren: false
        };
    },
    methods: {
        showId: function() {
            alert("ID: " + this.node.id);
        },
        toggleShowChildren: function() {
            this.showChildren = ! this.showChildren;

        },
        toggleChildrenIcon: function() {
            //return this.showChildren ? " bi-arrow-down" : " bi-arrow-right";
            //return this.showChildren ? " bi-arrows-collapse" : " bi-arrows-expand";
            return this.showChildren ? " bi-chevron-down" : " bi-chevron-right";
        },
    }
});

Vue.filter('nl2br', function(value) {
    if (typeof value !== 'string') {
        return value;
    }

    return value.replace(/\r?\n/g, '<br/>')
});

new Vue({
    el: '#app',
    data: {
        title: "简单内容块阅读器",
        blockId: 1,
        block: null,
        url: "",
    }, 
    methods: {
        getFileData: async function () {
            const filePath = await window.electronAPI.openFile()
            if (filePath === undefined) {
                return
            }
            const jsonData = await window.electronAPI.getFileData(filePath)
            this.block = jsonData.block;
            this.modifyBlocks(this.block);
            console.dir(this.block);
        },
        getUrlData: async function () {
            const jsonData = await window.electronAPI.getUrlData(this.url)
            this.block = jsonData.block;
            this.modifyBlocks(this.block, null);
            console.dir(this.block);
        },
        modifyBlocks: function (block,parent_id) {
            block.id = this.blockId++;
            block.parent_id = parent_id;
            for (let child of block.children) {
                this.modifyBlocks(child, block.id)
            }
        },
        saveData: async function () {
            const data = {
                block: this.block
            }
            await window.electronAPI.saveData(data)
        },
    }
  });
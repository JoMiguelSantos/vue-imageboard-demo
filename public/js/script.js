(function () {
    new Vue({
        // el - represents which element in our html will have access to our Vue code
        el: "#main",
        // an object that we add any info to that is dynamic / we want to render onscreen
        data: {
            images: [],
        },
        mounted: function () {
            var self = this;
            axios.get("/images").then((res) => {
                self.images = JSON.parse(res.data);
            });
        },
        methods: {
            getImages: function () {
                var self = this;
                axios.get("/images").then((res) => {
                    self.images = JSON.parse(res.data);
                });
            },
        },
    });
})();

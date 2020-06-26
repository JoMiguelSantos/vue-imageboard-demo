(function () {
    new Vue({
        // el - represents which element in our html will have access to our Vue code
        el: "#main",
        // an object that we add any info to that is dynamic / we want to render onscreen
        data: {
            images: [],
            title: "",
            description: "",
            file: null,
            username: "",
        },
        mounted: function () {
            var self = this;
            axios
                .get("/images")
                .then(function (res) {
                    self.images = res.data;
                })
                .catch(function (err) {
                    console.log(err);
                });
        },
        methods: {
            getImages: function () {
                var self = this;
                axios.get("/images").then((res) => {
                    self.images = res.data;
                });
            },
            handleSubmit: function () {
                var formData = new FormData();
                formData.append("title", this.title);
                formData.append("description", this.description);
                formData.append("username", this.username);
                formData.append("file", this.file);
                axios
                    .post("/upload", formData)
                    .then(function (res) {
                        console.log("res", res);
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
            },
            handleChange: function (e) {
                this.file = e.target.files[0];
                console.log("change", this, e.target.files[0]);
            },
        },
    });
})();

(function () {
    Vue.component("mountain", {
        props: ["id"],
        data: function () {
            return { mountain: {}, comments: [], comment: "", username: "" };
        },
        mounted: function () {
            var self = this;
            axios.get(`/images/${self.props.id}`).then((res) => {
                self.mountain = res.data;
            });
            axios.get(`/images/${self.props.id}/comments`).then((res) => {
                self.comments = res.data;
            });
        },
        methods: {
            toggleModal: function (e) {
                this.$emit("toggleModal");
            },
            handleSubmit: function () {
                var self = this;
                axios
                    .post(`images/${self.props.id}/comments`, {
                        text: self.text,
                        username: self.text,
                    })
                    .then(function (res) {
                        self.comments.unshift(res.data);
                        self.comment = "";
                        self.username = "";
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
            },
        },
        template: `
        <div>
            <span @click="toggleModal">X</span>
            <h1>{{ mountain.title }}</h1>
            <img src="{{ mountain.url }}" width="600" height="600">
            <p>{{ mountain.description }}</p>
            <p>Uploaded by {{ mountain.username}} on {{ mountain.created_at }} </p>
            <h3>Add a comment:</h3>
            <form @submit.prevent="handleSubmit">
                <label for="text">Comment</label>
                <input v-model="text" type="text" id="text" name="text >
                <label for="username">Username</label>
                <input v-model="username" type="text" id="username" name="username >
                <button class="submit-btn" type="submit"><i class="fa fa-paper-plane" aria-hidden="true"></i> Save</i></input>
            </form>
            <ul v-for='comment in comments'>
                <li>
                    <h2>{{ comment.text }}</h2>
                    <p>{{ comment.username }} on {{ comment.created_at }}</p>
                </li>
            </ul>
        </div>
            `,
    });

    new Vue({
        // el - represents which element in our html will have access to our Vue code
        el: "#main",
        components: ["mountain"],
        // an object that we add any info to that is dynamic / we want to render onscreen
        data: {
            images: [],
            title: "",
            description: "",
            file: null,
            username: "",
            mountainShow: false,
            currentMountain: "",
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
                var self = this;
                var formData = new FormData();
                formData.append("title", this.title);
                formData.append("description", this.description);
                formData.append("username", this.username);
                formData.append("file", this.file);
                axios
                    .post("/upload", formData)
                    .then(function (res) {
                        self.images.unshift(res.data.data);
                        self.title = "";
                        self.description = "";
                        self.username = "";
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
            },
            handleChange: function (e) {
                this.file = e.target.files[0];
            },
            toggleMountainShow: function () {
                this.mountainShow = !this.mountainShow;
            },
            selectMountain: function (e) {
                this.currentMountain = e.currentTarget.image.id;
            },
        },
    });
})();

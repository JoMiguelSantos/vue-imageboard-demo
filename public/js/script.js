(function () {
    var mountain = Vue.component("mountain", {
        props: ["id"],
        data: function () {
            return { mountain: {}, comments: [], text: "", username: "" };
        },
        mounted: function () {
            var self = this;
            axios.get(`/images/${this.id}`).then((res) => {
                self.mountain = res.data;
            });
            axios.get(`/images/${this.id}/comments`).then((res) => {
                self.comments = res.data;
            });
        },
        methods: {
            toggleModal: function (e) {
                this.$emit("togglemodal");
            },
            handleSubmit: function () {
                var self = this;
                axios
                    .post(`images/${self.id}/comments`, {
                        text: self.text,
                        username: self.username,
                    })
                    .then(function (res) {
                        self.comments.unshift(res.data);
                        self.text = "";
                        self.username = "";
                    })
                    .catch(function (err) {
                        console.log(err);
                    });
            },
        },
        template: `
        <div class="image__detail">
            <span class="close-btn" @click="toggleModal">X</span>
            <div class="image__detail--header" >
                <h1 class="image__detail--title">{{ mountain.title }}</h1>
                <p class="image__detail--description">{{ mountain.description }}</p>
                <img class="image__detail--img" :src="mountain.url" width="500" height="500"/>
                <p class="image__detail--creation-date">Uploaded by {{ mountain.username}} on {{ mountain.created_at }} </p>
            </div>
            <div class="image__detail--comments-container">
                <h2>Add a comment:</h2>
                <form class="image__detail--form" @submit.prevent="handleSubmit">
                    <label for="username">Username</label>
                    <input v-model="username" type="text" id="username" name="username" >
                    <label for="text">Comment</label>
                    <textarea v-model="text" id="text" name="text" rows="5" cols="40"></textarea>
                    <button class="submit-btn" type="submit"><i class="fa fa-paper-plane" aria-hidden="true"></i> Save</i></button>
                </form>
                <h2 class="comments__header">Comments:</h2>
                <ul class="image__detail--comments" >
                    <li v-for='comment in comments'>
                        <h3>{{ comment.text }}</h3>
                        <p>{{ comment.username }} on {{ comment.created_at }}</p>
                    </li>
                </ul>
            </div>
        </div>
            `,
    });

    new Vue({
        // el - represents which element in our html will have access to our Vue code
        el: "#main",
        components: { mountain },
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
            selectMountain: function (id) {
                this.currentMountain = id;
                this.toggleMountainShow();
            },
        },
    });
})();

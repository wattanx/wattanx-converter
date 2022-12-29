export default {
  name: 'MixinSample',
  props: {
    age: {
      type: Number,
      required: true,
    },
  },
  computed: {
    ...mapState('user', ['name', 'age']),
    ...mapGetters('user', ['name', 'age']),
    fullName() {
      return this.firstName + this.lastName;
    },
  },
  data() {
    return {
      firstName: 'first',
      lastName: 'last',
    };
  },
  methods: {
    ...mapActions('user', ['setUser']),
    async getInfo() {
      await fetch('https://www.google.com/');
    },
  },
  mounted() {
    console.log('mounted');
  },
  watch: {
    age() {
      console.log('watch');
    },
    someObject: {
      handler(newValue, oldValue) {
        console.log(newValue, oldValue);
      },
      deep: true,
    },
  },
};

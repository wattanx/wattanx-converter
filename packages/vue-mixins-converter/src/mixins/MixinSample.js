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
  },
  data() {
    return {
      firstName: 'first',
      lastName: 'last',
    };
  },
  computed: {
    fullName() {
      return this.firstName + this.lastName;
    },
  },
  methods: {
    ...mapActions('user', ['setUser']),
  },
};

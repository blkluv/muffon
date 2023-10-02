<template>
  <strong class="extra">
    <BaseArtistLinks
      :artists="artists"
    />
  </strong>
</template>

<script>
import BaseArtistLinks from '@/components/links/BaseArtistLinks.vue'

export default {
  name: 'ArtistsSection',
  components: {
    BaseArtistLinks
  },
  props: {
    trackData: {
      type: Object,
      required: true
    }
  },
  computed: {
    artists () {
      return this.trackData.artists
    }
  }
}
</script>

<style lang="sass" scoped></style>

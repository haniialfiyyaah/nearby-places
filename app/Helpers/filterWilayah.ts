export default (arr, type, level) => {
  return arr
    .filter(({ longitude, latitude }) => longitude && latitude)
    .map((data) => {
      return {
        name: data[`kemendagri_${type}_nama`],
        level,
        kemendagri_code: data[`kemendagri_${type}_kode`],
        longitude: data.longitude,
        latitude: data.latitude,
      }
    })
}

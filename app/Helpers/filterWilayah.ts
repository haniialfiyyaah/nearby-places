export default (arr, type, level, villages = []) => {
  const types =
    level === 'Kecamatan'
      ? 'kemendagri_kecamatan_kode'
      : level === 'Kabupaten/Kota'
      ? 'kemendagri_kota_kode'
      : 'kemendagri_kelurahan_kode'

  return arr
    .filter(({ longitude, latitude }) => longitude && latitude)
    .map((data) => {
      let village
      if (villages.length > 0)
        village = villages.filter(
          (e) => e[types] == data[`kemendagri_${type}_kode`]
        )[0]
      return {
        name: data[`kemendagri_${type}_nama`],
        level,
        kemendagri_code: data[`kemendagri_${type}_kode`],
        longitude: data.longitude,
        latitude: data.latitude,
        city_name: data.kemendagri_kota_nama,
        district_name:
          data.kemendagri_kecamatan_nama || village?.kemendagri_kecamatan_nama,
        village_name:
          data.kemendagri_kelurahan_nama || village?.kemendagri_kelurahan_nama,
      }
    })
}

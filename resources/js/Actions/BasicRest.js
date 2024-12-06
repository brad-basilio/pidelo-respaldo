import { Cookies, Fetch, Notify } from "sode-extend-react"

let controller = new AbortController()

class BasicRest {
  path = null
  hasFiles = false

  paginate = async (params) => {
    controller.abort('Nothing')
    controller = new AbortController()
    const signal = controller.signal
    const res = await fetch(`/api/${this.path}/paginate`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Xsrf-Token': decodeURIComponent(Cookies.get('XSRF-TOKEN'))
      },
      body: JSON.stringify(params),
      signal
    })
    return await res.json()
  }

  save = async (request, callback = () => { }) => {
    try {
      let status = false
      let result = {}
      if (this.hasFiles) {
        const res = await fetch(`/api/${this.path}`, {
          method: 'POST',
          headers: {
            'X-Xsrf-Token': decodeURIComponent(Cookies.get('XSRF-TOKEN'))
          },
          body: request
        })
        status = res.ok
        result = JSON.parseable(await res.text())
      } else {
        const fetchRes = await Fetch(`/api/${this.path}`, {
          method: 'POST',
          body: JSON.stringify(request)
        })
        status = fetchRes.status
        result = fetchRes.result
      }

      if (!status) throw new Error(result?.message || 'Ocurrio un error inesperado')

      Notify.add({
        icon: '/assets/img/icon.svg',
        title: 'Correcto',
        body: result.message,
        type: 'success'
      })
      callback?.()
      return result
    } catch (error) {
      Notify.add({
        icon: '/assets/img/icon.svg',
        title: 'Error',
        body: error.message,
        type: 'danger'
      })
      return null
    }
  }

  status = async ({ id, status }) => {
    try {
      const { status: fetchStatus, result } = await Fetch(`/api/${this.path}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ id, status })
      })
      if (!fetchStatus) throw new Error(result?.message ?? 'Ocurrio un error inesperado')

      Notify.add({
        icon: '/assets/img/icon.svg',
        title: 'Correcto',
        body: result.message,
        type: 'success'
      })

      return true
    } catch (error) {
      Notify.add({
        icon: '/assets/img/icon.svg',
        title: 'Error',
        body: error.message,
        type: 'danger'
      })

      return false
    }
  }

  boolean = async ({ id, field, value }) => {
    try {
      const { status: fetchStatus, result } = await Fetch(`/api/${this.path}/boolean`, {
        method: 'PATCH',
        body: JSON.stringify({ id, field, value })
      })
      if (!fetchStatus) throw new Error(result?.message ?? 'Ocurrio un error inesperado')

      Notify.add({
        icon: '/assets/img/icon.svg',
        title: 'Correcto',
        body: result.message,
        type: 'success'
      })

      return true
    } catch (error) {
      Notify.add({
        icon: '/assets/img/icon.svg',
        title: 'Error',
        body: error.message,
        type: 'danger'
      })

      return false
    }
  }

  delete = async (id) => {
    try {
      const { status: fetchStatus, result } = await Fetch(`/api/${this.path}/${id}`, {
        method: 'DELETE'
      })
      if (!fetchStatus) throw new Error(result?.message ?? 'Ocurrio un error inesperado')

      Notify.add({
        icon: '/assets/img/icon.svg',
        title: 'Correcto',
        body: result.message,
        type: 'success'
      })

      return true
    } catch (error) {
      Notify.add({
        icon: '/assets/img/icon.svg',
        title: 'Error',
        body: error.message,
        type: 'danger'
      })

      return false
    }
  }
}

export default BasicRest
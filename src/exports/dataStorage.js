const expiryPeriod = 15 * 60 * 1000 //5 minutes
export class StorageCache {
    constructor(prefixKey, suffixKey = '') {
        this.suffixKey = suffixKey
        this.prefixKey = prefixKey
    }
    getKey() {
        if (this.suffixKey) {
            return `${this.prefixKey}-${this.suffixKey}`
        } else {
            return this.prefixKey
        }
    }

    getObject() {
        try {
            const obj = JSON.parse(localStorage.getItem(this.getKey()))
            return {
                ...obj,
                is_valid: Date.now() - obj.timestamp < expiryPeriod,
            }
        } catch (err) {
            return { value: {}, is_valid: false }
        }
    }

    getArray() {
        try {
            const obj = JSON.parse(localStorage.getItem(this.getKey()))
            return {
                ...obj,
                is_valid: Date.now() - obj.timestamp < expiryPeriod,
            }
        } catch (err) {
            return { value: [], is_valid: false }
        }
    }

    set(value) {
        try {
            const obj = { value, timestamp: Date.now() }
            const _key = this.getKey()
            localStorage.setItem(_key, JSON.stringify(obj))
        } catch (err) {
            console.error('set', err)
            throw new Error('Cannot Store')
        }
    }

    reset() {
        ///////remove all items
        try {
            ////////////////////////
            const { prefixKey } = this
            localStorage.removeItem(prefixKey)
            //keys from suffix keys
            const keys = Object.keys(localStorage).filter(
                key => key.indexOf(prefixKey) == 0
            )

            console.log('storage keys:', keys)

            ///remove all items
            for (const key of keys) {
                localStorage.removeItem(key)
            }
            //////////////////////////
        } catch (err) {
            console.error('reset', err)
        }
    }

    updateSelection({ stateList, selectionCommit, sortCompare }, data, id) {
        let idx = stateList.findIndex(x => x.id === id)
        idx = idx >= 0 ? idx : stateList.length

        if (data) stateList.splice(idx, 1, data)
        else stateList.splice(idx, 1)

        if (typeof sortCompare == 'function') stateList.sort(sortCompare)

        this.set(stateList)
        if (typeof selectionCommit == 'function') selectionCommit(data)
    }
}

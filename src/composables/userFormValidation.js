import { ref, computed } from 'vue'

export function useFormValidation() {
    const errors = ref({})

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return re.test(String(email).toLowerCase())
    }

    const validateRequired = (value, fieldName) => {
        if (!value || (typeof value === 'string' && !value.trim())) {
            errors.value[fieldName] = `${fieldName} is required`
            return false
        }
        return true
    }

    const validateMinLength = (value, fieldName, minLength) => {
        if (value.length < minLength) {
            errors.value[fieldName] = `${fieldName} must be at least ${minLength} characters`
            return false
        }
        return true
    }

    const validatePrice = (value) => {
        if (isNaN(value) || value < 0) {
            errors.value.price = 'Price must be a valid positive number'
            return false
        }
        return true
    }

    const validateStock = (value) => {
        if (!Number.isInteger(value) || value < 0) {
            errors.value.stock = 'Stock must be a valid positive integer'
            return false
        }
        return true
    }

    const validate = (form, rules) => {
        errors.value = {}
        let isValid = true

        Object.keys(rules).forEach(field => {
            rules[field].forEach(rule => {
                if (!isValid) return

                switch (rule.type) {
                    case 'required':
                        isValid = validateRequired(form[field], field)
                        break
                    case 'email':
                        if (!validateEmail(form[field])) {
                            errors.value[field] = 'Invalid email format'
                            isValid = false
                        }
                        break
                    case 'minLength':
                        isValid = validateMinLength(form[field], field, rule.value)
                        break
                    case 'price':
                        isValid = validatePrice(form[field])
                        break
                    case 'stock':
                        isValid = validateStock(form[field])
                        break
                }
            })
        })

        return isValid
    }

    const hasErrors = computed(() => Object.keys(errors.value).length > 0)

    const clearErrors = () => {
        errors.value = {}
    }

    const getError = (field) => errors.value[field]

    return {
        errors,
        hasErrors,
        validate,
        clearErrors,
        getError
    }
}
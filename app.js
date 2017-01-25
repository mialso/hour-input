function inputListener(e) {
	const val = e.target.value
	console.log('%o', e)
	console.log('input: '+val)
	const data = val.split(':')

	data.forEach(function(val, index) {
		const num = Number.parseInt(val)
		console.log('data['+index+']='+val+'='+num)
		if (Number.isNaN(num)) {
			console.log('not a number')
			data[index] = ''
			return
		}
		switch(index) {
			case 0:
				if (num > 2 && num < 10) {
					data[index] = '0'+num.toString()
					console.log('hours: '+data[index])
					return
				}
				console.log('replacing 24: '+num)
				data[index] = num < 24 ? num.toString() : '0'
				break
			case 1:
				if (num > 5 && num < 10) {
					data[index] = '0'+num.toString()
					console.log('minutes: '+data[index])
					return
				}
				data[index] = num < 60 ? num : ''
				break
			default:
				console.log('default case')
				data[index] = ''
		}
	})
	//if (!data[0] || data[0] === '') data[0] = '00'
	if (data[0].length >= 2) {
		console.log('length > 2')
		if (!data[1] || data[1] === '') {
			//data[1] = '00'
		}
		if(!data[1]) {
			e.target.value = data[0]+':'
			return
		} else {
			e.target.value = data.join(':')
			return
		}
	}
	e.target.value = data[0]
}
function focusListener(e) {
	console.log('focus: '+e.target.value)
}
function changeListener(e) {
	console.log('change: '+e.target.value)
}
function blurListener(e) {
	console.log('blur: '+e.target.value)
}
function mouseListener(e) {
	console.log('mouse')
}
window.onload = function() {
	console.log('im loaded')
	const hInp = document.getElementById('hourInput')
	hInp.addEventListener('change', function(e) {
		console.log('change: '+e.target.value)
	})
	hInp.addEventListener('input', inputListener)
	hInp.addEventListener('focus', focusListener)
	hInp.addEventListener('blur', blurListener)
}

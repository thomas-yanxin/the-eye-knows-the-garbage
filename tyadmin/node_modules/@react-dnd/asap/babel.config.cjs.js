module.exports = {
	presets: [
		[
			'@babel/preset-env',
			{
				modules: 'cjs',
				targets: {
					browsers: ['>0.25%, not dead'],
				},
			},
		],
	],
}

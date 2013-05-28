ig.module(
	'plugins.google.constants'
)
.defines(function() {
	ig.GGS.constants = {
		ACHIEVEMENTS: {
			ROYAL_FLUSH: {
				code: 'CgkIrrPQrpMPEAIQAQ',
			},
			STRAIGHT_FLUSH: {
				code: 'CgkIrrPQrpMPEAIQAg',
			},
			FOUR_OF_KIND: {
				code: 'CgkIrrPQrpMPEAIQAw',
			},
			FULL_HOUSE: {
				code: 'CgkIrrPQrpMPEAIQBA',
			},
			FLUSH: {
				code: 'CgkIrrPQrpMPEAIQBQ',
			},
			STRAIGHT: {
				code: 'CgkIrrPQrpMPEAIQBg',
			},
			THREE_OF_KIND: {
				code: 'CgkIrrPQrpMPEAIQBw',
			},
			TWO_PAIR: {
				code: 'CgkIrrPQrpMPEAIQCA',
			},
			ONE_PAIR: {
				code: 'CgkIrrPQrpMPEAIQCQ',
			}
		},
		
		LEADERBOARDS: {
			FREE_KNAVE: {
				code: 'CgkIrrPQrpMPEAIQCg',
			},
			FREE_KNIGHT: {
				code: 'CgkIrrPQrpMPEAIQCw',
			},
			FREE_KING: {
				code: 'CgkIrrPQrpMPEAIQDA',
			},
		},

		CLIENT_ID:'520594135470-qtdcvsvjtcl751dsdclsttj8osmhrsqs.apps.googleusercontent.com',
		//CLIENT_ID:'520594135470.apps.googleusercontent.com',
		APP_ID:'520594135470',

		LINK_PAGE_BASE: 'https://www.example.com/linkPage/index.php'
	}
});
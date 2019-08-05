/* Data */

module.exports = {

  default_conversation :
    {
      "description": "New Conversation",
      "character-left": [
        0
      ],
      "character-right": [],
      "type": 0,
      "content": [
        {
          "id": 0,
          "character": [
            0
          ],
          "content": "Initial Content",
          "duration": 3,
          "name-overwrite": ""
        }
      ]
    },

  characters : 
    [
      {
        "id": 0,
        "name": "Eclair",
        "color": "#F27936",
        "abbreviation": "エ"
      },
      {
        "id": 1,
        "name": "Oreillette",
        "color": "#2059b5",
        "abbreviation": "オ"
      },
      {
        "id": 2,
        "name": "Friand",
        "color": "#37ddb7",
        "abbreviation": "フ"
      },
      {
        "id": 3,
        "name": "Brioche",
        "color": "#dd452a",
        "abbreviation": "ブ"
      },
      {
        "id": 4,
        "name": "Savoie",
        "color": "#59b1d1",
        "abbreviation": "サ"
      },
      {
        "id": 10,
        "name": "Archive",
        "color": "#b73aff",
        "abbreviation": "ア"
      }
    ],

  conversationTypes : 
    [
      {
        "id": 0,
        "name": "Automatic"
      },
      {
        "id": 1,
        "name": "Manual"
      },
      {
        "id": 2,
        "name": "Driven by Events"
      }
    ]

}
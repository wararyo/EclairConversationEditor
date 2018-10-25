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
        "color": "#F27936"
      },
      {
        "id": 1,
        "name": "Oreillette",
        "color": "#2059b5"
      },
      {
        "id": 2,
        "name": "Friand",
        "color": "#37ddb7"
      },
      {
        "id": 3,
        "name": "Brioche",
        "color": "#dd452a"
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
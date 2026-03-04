### quiz crud api

<hr>
<p align="center">
  <a href="https://skillicons.dev">
    <img src="https://skillicons.dev/icons?i=express,vscode,postman,git,linux" />
  </a>
</p>
<p align="center">yordamida yaratilgan...</p>
<hr>

| endpoint                     | tavsifi                                                                                                                    | methodi |
| ---------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------- |
| `/quiz`                      | barcha savollarni javoblari bilan olib keladi                                                                              | GET     |
| `/quiz/:id`                  | quizni id bo'yicha olib keladi                                                                                             | GET     |
| `/quiz/:id`                  | quizni id bo'yicha o'chiradi                                                                                               | DELETE  |
| `/quiz/:id/answer`           | ko'rsatilgan id bo'yicha javoblarni yaratadi `answer_title` (string) va `is_correct` (boolean) parametrlarini qabul qiladi | POST    |
| `/quiz/:id/answer/:answerId` | ko'rsatilgan id quiz va uning ko'rsatilgan id javobini qiymatini yangilaydi                                                | PUT     |
| `/quiz/:id/answer/:answerId` | ko'rsatilgan id'ning berilgan id'si bo'yicha javobini o'chiradi                                                            | DELETE  |

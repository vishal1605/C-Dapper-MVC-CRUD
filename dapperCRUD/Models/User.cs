namespace dapperCRUD.Models
{
    public class User
    {
        public int U_id { get; set; }

        public string Email { get; set; }

        public string Name { get; set; }

        public string Psw { get; set; }

        public DateTime RegisterDate { get; set; }

        public List<Car> Car { get; set; }

        public User(int id, string email, string name, string password, List<Car> car)
        {
            this.U_id=id;
            this.Email=email;
            this.Name=name;
            this.Psw=password;
            Car=car;
        }
        public User()
        {

        }
    }
}

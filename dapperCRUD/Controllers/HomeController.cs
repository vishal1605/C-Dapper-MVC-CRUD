using Dapper;
using dapperCRUD.Models;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Data.SqlClient;
using System.Diagnostics;

namespace dapperCRUD.Controllers
{
    public class HomeController : Controller
    {
        private IConfiguration Configuration;

        public HomeController(IConfiguration _configuration)
        {
            Configuration = _configuration;
        }
        

        [HttpPost]
        public JsonResult Insert([FromBody] List<User> list)
        {
            List<int> ids = new List<int>();
            list.ForEach(u =>
            {
                string query = $"insert into tbluser(email,name,psw) values ('{u.Email}', '{u.Name}', '{u.Psw}')";
                SqlConnection con = new SqlConnection(this.Configuration.GetConnectionString("DefaultConnection"));
                con.Execute(query);

                string getQuery = "select u_id from tbluser where email=@email and name=@name and psw=@psw";
                int id = con.QueryFirstOrDefault<int>(getQuery, u);
                ids.Add(id);
            });
            
            JsonConvert.SerializeObject(ids);
            return Json(ids);
        }

        public IActionResult AllData()
        {

            string query = "select * from tbluser";
            SqlConnection con = new SqlConnection(this.Configuration.GetConnectionString("DefaultConnection"));

            List<User> user = con.Query<User>(query).ToList();
            return View(user);
        }

        public JsonResult Delete(int id)
        {
            Console.WriteLine(id);
            string query = "delete from tbluser where u_id=@u_id";
            SqlConnection con = new SqlConnection(this.Configuration.GetConnectionString("DefaultConnection"));
            con.Execute(query, new { U_id = id });
            return Json("deleted");
        }

        [HttpPost]
        public JsonResult Update([FromBody] User u)
        {

            string query = "update tbluser set email=@email, name=@name, psw=@psw where u_id = @u_id";
            SqlConnection con = new SqlConnection(this.Configuration.GetConnectionString("DefaultConnection"));

            var result = con.Execute(query, u);
            Console.WriteLine(u.U_id);
            return Json("Success");
        }

        public IActionResult Details(string user)
        {
            Console.WriteLine(user);
            string query = "select * from car where u_id=(select u_id from tbluser where email=@email)";
            SqlConnection con = new SqlConnection(this.Configuration.GetConnectionString("DefaultConnection"));
            List<Car> c = con.Query<Car>(query, new { Email = user }).ToList();

            return View(c);  
        }

        public IActionResult LoginForm()
        {

            return View();
        }

        public RedirectResult LoginProcess(User u)
        {
            string query = "select * from tbluser where name=@name and psw=@psw";
            SqlConnection con = new SqlConnection(this.Configuration.GetConnectionString("DefaultConnection"));
            User user = con.QuerySingleOrDefault<User>(query, u);
            if(user == null)
            {
                return Redirect("/Home/LoginForm");
            }
            HttpContext.Session.SetString("SessionUser", JsonConvert.SerializeObject(u));
            Console.WriteLine(user.U_id);
            return Redirect("/Home/Center");
        }
        public IActionResult Center()
        {
            var u = JsonConvert.DeserializeObject<User>(HttpContext.Session.GetString("SessionUser"));

            return View(u);
        }



    }
}
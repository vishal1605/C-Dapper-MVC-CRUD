namespace dapperCRUD.Models
{
    public class Car
    {
        public int CarId { get; set; }
        public string CompanyName { get; set; }
        public string ModelName { get; set; }

        public Car(int id, string CName, string MName)
        {
            this.CarId=id;
            this.CompanyName=CName;
            this.ModelName=MName;
            

        }

        public Car()
        {
            

        }
         
    }
}

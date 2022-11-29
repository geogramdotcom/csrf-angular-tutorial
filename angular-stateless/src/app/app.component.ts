import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  constructor(private httpService: HttpClient) { }
  serverResponse: any;
  csrfToken: string = "";
  title = 'Angular StateLESS CSRF Protection Implementation';

  ngOnInit(){
    this.httpService.get('/csrf-token').subscribe((data:any) => {
      console.log(data);
      this.csrfToken = data.token;
    });
  }

  onSubmit(f: NgForm) {
    // TODO: Handle Form Validations
    console.log(f.value);  // { first: '', last: '', secret: ''}
    console.log(f.valid);  // false

    if(f.valid){
      // Use this if using the Header method: csrfSync default config
      // Change the header name (default is 'x-csrf-token')
      var options = { headers: {
        'app-csrf-token': this.csrfToken, // make sure to add this custom header name to csrf-csrf doubleSubmit
        'Content-Type': 'application/json'

      } }

      this.httpService.post('/protected_endpoint', f.value, options).subscribe(res => {
        // TODO: handle response for client
        console.log("response:", res)
        this.serverResponse = res;
      });
    } else {
      // handle form error
      console.error("form invalid")
    }
    
  }
}

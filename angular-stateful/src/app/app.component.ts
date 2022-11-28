import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
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
  title = 'Angular Stateful CSRF Protection Implementation';

  ngOnInit(){
    this.httpService.get('/csrf-token').subscribe((data:any) => {
      console.log(data);
      this.csrfToken = data.csrfToken;
    });
  }

  onSubmit(f: NgForm) {
    // TODO: Handle Form Validations
    console.log(f.value);  // { first: '', last: '', secret: ''}
    console.log(f.valid);  // false

    if(f.valid){
      // Use this if using the Header method: csrfSync default config
      // Change the header name (default is 'x-csrf-token')
      var options = { headers: {'app-csrf-token': this.csrfToken} }
      // Use this if using the csrfSync with body based token
      f.value.csrfToken = this.csrfToken;

      this.httpService.post('/process', f.value, options).subscribe(res => {
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

